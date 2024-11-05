from fastapi import status
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader

from database_layer.milvus_client import MilvusDB
from llm_layer.chunk_text import chunk_extracted_text
from schemas.schema import BusinessURL
from service_layer.vector_db_service import add_to_collection
from CONSTANTS import metadata_field_document, CLIENT_DATA_COLLECTION as client_collection

import io
from requests import Response
import requests


def fetch_and_extract_client_data(business_url: BusinessURL, vector_db: MilvusDB):
    """
    This method aims to fetch and extract client data, by leveraging a pre-signed URL received
    after successful upload of data on s3

    :return: JSON Response regarding operation status
    """

    # Extracting the URL and unique-key from the pre-signed URL
    pre_signed_url = business_url.fileUrl
    file_key = business_url.fileKey

    try:
        response: Response = requests.get(pre_signed_url)
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content="Unable to Fetch Data from Client URL"
        )


    try:
        # Extracting Text from Data Response
        extracted_text = process_client_data(response)

        # Chunking Text and Preparing Data for Insertion
        chunked_text_list = chunk_extracted_text(text=extracted_text)

        # Performing Add Operation
        add_status = add_to_collection(
            collection_name=client_collection,
            document=chunked_text_list,
            metadata=[{metadata_field_document: file_key}],
            vector_db=vector_db
        )

        if add_status.get('insert-count') == len(chunked_text_list):
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=True
            )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=e
        )


def process_client_data(response: Response):
    """
    This function reads the response data and parses it's content for readability

    :param response: response body obtained from request
    :return: processed and readable text
    """
    try:
        pdf_file = io.BytesIO(response.content)
    except Exception as e:
        print(f"Failed to read Client Data,\nError Stack Trace : {str(e)}")
        raise ValueError(f"Failed to read Client Data,")
    try:
        # Extracting and concatenating text from PDF
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

    except Exception as e:
        print(f"Error Occurred While Performing Operation on Client Data,\nError stack Trace: {str(e)}")
        raise ValueError(f"Error Occurred While Performing Operation on Client Data,")

    return text
