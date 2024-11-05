from pymilvus.milvus_client.index import IndexParams

from CONSTANTS import field_name_vectors

def create_index_params(index_params: IndexParams):
    """
    This function creates the common index parameters required to configure
    a collection

    :param index_params: Vector database client's index parameters instance
    :return: Configured Index Parameters
    """
    index_params.add_index(
        field_name=field_name_vectors,
        metric_type="L2",
        index_type="HNSW",
        params={
            "M": 16,
            "efConstruction": 200
        }
    )
    return index_params