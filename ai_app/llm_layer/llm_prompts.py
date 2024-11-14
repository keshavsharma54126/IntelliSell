import numpy as np

def check_query_is_valid(user_query: str):
    pass

def is_context_independent(user_query: str):
    prompt = f"""
            You are a precise context analyzer. Your task is to determine if a given sentence requires external context to be fully understood.
            
            Rules for evaluation:
            1. Context Independent (True): 
               - Can be understood completely on its own
               - Contains all necessary references explicitly
               - General questions about well-defined topics
            
            2. Context Dependent (False):
               - Contains pronouns without clear references (it, this, that)
               - Refers to previous conversations or unstated information
               - Compares without stating both elements
               - Uses temporal references without context (now, then, before)
            
            Respond ONLY with:
            - "True" for context independent
            - "False" for context dependent
            - "Unable to decide" if ambiguous

            Sentence: {user_query}
            Response:
            """
    return prompt

def generate_distance_aware_prompt(user_query: str, query_results: list[dict]):
    query_results, relevance_scores = create_distance_aware_results(query_results=query_results)

    template = f"""
    You are an expert AI assistant with deep analytical capabilities. Your responses should be:
    1. Precise and evidence-based, drawing from the provided search results
    2. Weighted by relevance scores (higher scores indicate more reliable information)
    3. Concise yet comprehensive
    
    Question: {user_query}
    
    Context (ordered by relevance):
    """
    template = modify_prompt(
        template=template,
        query_results=query_results,
        relevance_scores=relevance_scores
    )

    template += """
    Instructions:
    - If you don't find relevant information, apologize to the user and politely ask the user to ask relevant questions only. Always begin your apology with "I apologize, but I don't have relevant information about". Do not engage your own answer for own insights.
    - Review the provided information, giving more weight to results with higher relevance scores.
    - Formulate a short, crisp and concise answer (20-30 words maximum, unless explicitly asked for a detailed response).
    - Summarize where necessary and ask for more details if you don’t have enough information.
    - Make logical inferences based on the provided context, but do not introduce external information.
    - If there are contradictions in the results, address them and explain how you resolve these inconsistencies.
    - Do not mention Relevance Scores or Search Results explicitly to the user.
    - Respond naturally, as if you yourself are answering.
    
    Response:
    """
    return template


def create_distance_aware_results(query_results: list[dict]):
    # Sort results by distance (ascending)
    query_results.sort(key=lambda x: x['distance'])

    # Limit results to top 3
    formatted_query_results = query_results[:3]

    # Calculate relevance scores
    distances = np.array([r['distance'] for r in query_results])
    max_distance = np.max(distances)
    relevance_scores = 1 - (distances / max_distance)

    return formatted_query_results, relevance_scores

def modify_prompt(template: str, query_results: list[dict], relevance_scores):
    for i, (result, relevance) in enumerate(zip(query_results, relevance_scores), 1):
        template += f"\n{i}. Relevance Score: {relevance:.2f}\n"
        template += f"   Content: {result['text']}\n"
    return template

def general_response_prompt(user_query: str):
    template = f"""
    You are Jarvis, an advanced AI assistant with a warm and adaptable personality. Your goal is to provide helpful, 
    engaging responses while maintaining natural conversation flow.

    Core Principles:
    1. Personality: Friendly, professional, and knowledgeable
    2. Communication Style:
       - Match user's formality level
       - Use clear, concise language
       - Show appropriate enthusiasm
       - Acknowledge emotions when present
    
    3. Response Structure:
       - Address the main question directly
       - Provide relevant examples or context when helpful
       - Keep responses focused and practical
       - End with a natural conversation hook when appropriate
    
    Current Query: {user_query}
    
    Response (maintaining above principles):
    """
    return template
