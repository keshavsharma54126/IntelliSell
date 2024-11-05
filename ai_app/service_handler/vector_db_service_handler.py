from pymilvus import FieldSchema, DataType, CollectionSchema
from CONSTANTS import (field_name_primary_key, field_name_vectors, field_name_document, field_name_cached_question,
                       client_collection_description, cache_collection_description, CLIENT_DATA_COLLECTION,
                       CACHED_QUESTION_ANSWERS)

def create_schema(collection_name: str):
    """
    This function is a wrapper for dynamically creating schemas based on the type of collection
    :param collection_name: Name/Type of collection
    :return: Schema
    """

    # The ID field is mandatory and common to all
    fields = [
        FieldSchema(name=field_name_primary_key, dtype=DataType.INT64, is_primary=True, auto_id=True)
    ]

    # The field names change slightly based on the types of collection
    if collection_name == CLIENT_DATA_COLLECTION:
        description = client_collection_description
        fields.append(FieldSchema(name=field_name_document, dtype=DataType.VARCHAR, max_length=65535))

    elif collection_name == CACHED_QUESTION_ANSWERS:
        description = cache_collection_description
        fields.append(FieldSchema(name=field_name_cached_question, dtype=DataType.VARCHAR, max_length=65535))

    # Schemas can only be constructed for pre-defined collection names/types to avoid un-necessary collections
    else:
        raise ValueError("Error creating schema, collection name needs to be within the configured set.")

    # Including the mandatory vector data field
    fields.append(FieldSchema(name=field_name_vectors, dtype=DataType.FLOAT_VECTOR, dim=768))

    # Creating the collection
    schema = CollectionSchema(
        fields=fields,
        description=description,
        enable_dynamic_field=True
    )
    return schema