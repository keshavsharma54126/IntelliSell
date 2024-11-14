from langchain.text_splitter import RecursiveCharacterTextSplitter # type: ignore

def chunk_extracted_text(text: str):
    """
    This method aims to chunk text semantically, to ensure no splitting occurs
    mid-sentence or mid-phrase for intelligent chunks.

    :param text: Extracted Client Data
    :return: List of individual Chunked Items
    """
    try:

        # Using LangChain's Recursive Text Splitter for chunking
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=10000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
        chunks = text_splitter.split_text(text)
        return chunks

    except Exception as e:
        print(f"Failed to Chunk Extracted Text.\nError Stack Trace: {e}")
        raise ValueError("Failed to Chunk Extracted Text")
