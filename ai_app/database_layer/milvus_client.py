from pymilvus import MilvusClient, CollectionSchema
from sentence_transformers import SentenceTransformer

from CONSTANTS import (DEFAULT_EMBEDDING_MODEL, ZILLIZ_MILVUS_URI, ZILLIZ_MILVUS_TOKEN,field_name_vectors,
                       field_name_document, CLIENT_DATA_COLLECTION, field_name_cached_question)
from database_operation_handler.vector_db_operation_handler import create_index_params

import os
from typing import Optional



class MilvusDB:

    def __init__(self, db_name: str, embedding_model: Optional[str] = DEFAULT_EMBEDDING_MODEL) -> None:
        """
        Constructor function for initializing Milvus client along with necessary dependencies

        :param db_name: Name of vector-database
        :param embedding_model: Embedding model for creating high dimension vectors
        """

        # Creating a cloud instance for milvus database on zilliz cloud
        self.client = MilvusClient(
            uri=os.getenv(ZILLIZ_MILVUS_URI),
            token=os.getenv(ZILLIZ_MILVUS_TOKEN),
            db_name=db_name
        )

        # Creating a cache directory for local embedding model(s)
        script_dir = os.path.dirname(os.path.realpath(__file__))
        cache_folder_path  = os.path.join(script_dir, '..', 'model')

        # Loading/Downloading the model for embedding text into vectors
        self.encoder = SentenceTransformer(model_name_or_path=embedding_model,
                                           cache_folder=cache_folder_path)

    def collection_exists(self, collection_name: str):
        """
        This function checks whether given collection exists in the configured vector-database

        :param collection_name: Name of collection
        :return: Boolean
        """
        return self.client.has_collection(collection_name=collection_name)

    def create_collection(self, collection_name: str, schema: CollectionSchema):
        """
        This function creates a collection based on the schema, and index created

        :param collection_name: Name of collection to be created
        :param schema: Schema Design for Database
        :return:
        """

        # Preparing indexing parameters for collection
        index_params = self.client.prepare_index_params()

        index_params = create_index_params(index_params=index_params)

        create_status = self.client.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params
        )

        return create_status
    
    def add_to_db(self, collection_name: str, document: list[str], metadata: Optional[list[dict]] = None):
        """
        This method aims to add documents, vectors and any metadata attached to the Milvus database.

        :param collection_name: Name of the configured collection
        :param document: List of documents to be added
        :param metadata: Optional list of metadata to be added for increased search semantics
        :return: The result of the operation
        """

        # Embedding vectors using SBERT
        vectors = [self.encoder.encode(doc).tolist() for doc in document]

        field_name_text = field_name_document if collection_name == CLIENT_DATA_COLLECTION \
            else field_name_cached_question

        # Preparing a base-data configuration independent of metadata capable of insertion
        data = [
            {
                field_name_vectors: v,
                field_name_text: t
            }
            for v, t in zip(vectors, document)
        ]

        # Attaching metadata to base-data if present
        if metadata is not None and len(metadata) == len(document):
            for data_dict_item, meta in zip(data, metadata):
                data_dict_item.update(meta)


        elif metadata is not None and len(metadata) == 1:
            metadata_dict = metadata[0]
            key, value = next(iter(metadata_dict.items()))
            for data_dict_item in data:
                data_dict_item[key] = value

        # Performing final operation post data preparation
        add_result = self.client.insert(
            collection_name=collection_name,
            data=data
        )

        return add_result
    
    def drop_collection(self, collection_name:str):
        """
        In development, will be locked only to be accessible for use by administrative authorities

        :param collection_name: Name of collection
        :return: Drop status
        """

        if self.client.has_collection(collection_name=collection_name):
            self.client.drop_collection(collection_name=collection_name)

    def query_db(self, collection_name: str, query: str, output_fields: list[str]):
        """
        This function queries the collection with the user's message, returning the highest matching
        results along with additional information

        :param collection_name: Name of collection
        :param query: User's message
        :param output_fields: Mandatory fields to be included in search results
        :return: Fetched search results
        """

        # Encoding user's message into high-dimension vectors
        query_vectors = [self.encoder.encode(query).tolist()]

        # Searching and returning results from vector-database
        search_result = self.client.search(
            collection_name=collection_name,
            data=query_vectors,
            limit=5,
            output_fields=output_fields
        )

        return search_result
