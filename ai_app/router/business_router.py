from database_layer.milvus_client import MilvusDB
from fastapi import APIRouter, Depends

from data_handling.business_operation import fetch_and_extract_client_data
from schemas.schema import BusinessURL
from utilities.startup import startup_utilities

import requests

router = APIRouter(
    prefix='/client',
    tags=['business']
)

@router.post('/fetch-data')
def fetch_client_data(business_url: BusinessURL,
                      vector_db: MilvusDB = Depends(startup_utilities.get_vector_database_client)):
    """
    This route functions as a business wrapper for client data processing

    :param business_url:
    :param vector_db:
    :return:
    """
    return fetch_and_extract_client_data(business_url, vector_db)