from typing import Optional, List
from database_layer.milvus_client import MilvusDB
from service_handler.vector_db_service_handler import create_schema
from CONSTANTS import CLIENT_DATA_COLLECTION, client_collection_description, cache_collection_description

def create_collection(collection_name: str, vector_db: MilvusDB):
    """
    This service method, functions as a wrapper to create a collection based on name/type provided

    :param collection_name: Name/type of collection
    :param vector_db: Vector database session instance
    :return:
    """

    # Create schema dynamically based on type of collection
    schema = create_schema(collection_name=collection_name)

    # Create collection from schema
    vector_db.create_collection(
        collection_name=collection_name,
        schema=schema
    )

def add_to_collection(collection_name: str,document: list[str],
                      vector_db: MilvusDB, metadata : Optional[list[dict]] = None):
    """
    This service method, functions as a wrapper to add data and any related metadata to the database

    :param collection_name: Name of collection
    :param document: List of documents to be inserted
    :param vector_db: Vector database session instance
    :param metadata: Additional metadata, if any
    :return: Add operation result, containing total number of successful additions, etc.
    """
    try:
        # Ensuring that the collection exists before operation
        if not vector_db.collection_exists(collection_name=collection_name):
            create_collection(collection_name=collection_name, vector_db=vector_db)

        # Adding documents, and returning operation result
        add_result: dict = vector_db.add_to_db(
            collection_name=collection_name,
            document=document,
            metadata=metadata
        )

        return add_result

    except Exception as e:
        raise ValueError("Error occurred while adding data to vector database")

def query_documents_in_db(collection_name: str, user_query:str,
                          output_fields: list[str], vector_db: MilvusDB):
    """
    This service method, functions as a wrapper to perform vector/semantic search operations

    :param collection_name: Name of collection
    :param user_query: Message received from user
    :param output_fields: Data fields required in query response structure
    :param vector_db: Vector database session instance
    :return: Semantically matched results
    """

    # Ensuring that the collection exists before operation
    if not vector_db.collection_exists(collection_name=collection_name):
        raise ValueError("Collection does not exist!")

    # Searching semantically accurate responses and returning obtained result
    query_result: List[List[dict]] = vector_db.query_db(
        collection_name=collection_name,
        query=user_query,
        output_fields=output_fields
    )

    return query_result
