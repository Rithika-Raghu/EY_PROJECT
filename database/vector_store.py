import chromadb
from chromadb.config import Settings
from chromadb import PersistentClient
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from datetime import datetime
from typing import List, Dict
import uuid


class ChromaDBStore:
    """
    ChromaDB Vector Store for conversation history, user memory and insights
    """

    def __init__(self):
        # NEW ChromaDB client (no deprecated Settings)
        self.client = PersistentClient(
            path="./chroma_db"   # All vector data is stored here
        )

        # Embedding function (recommended)
        self.embed_fn = SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        # Conversations collection
        self.conversations = self.client.get_or_create_collection(
            name="conversations",
            metadata={"description": "Customer conversations"},
            embedding_function=self.embed_fn
        )

        # Insights collection
        self.insights = self.client.get_or_create_collection(
            name="insights",
            metadata={"description": "Customer insights"},
            embedding_function=self.embed_fn
        )

    # ------------------------------
    # Conversation Storage
    # ------------------------------

    def add_conversation(self, session_id: str, message: str, sentiment: str):
        """
        Store conversation in vector database
        """
        self.conversations.add(
            documents=[message],
            metadatas=[{
                "session_id": session_id,
                "sentiment": sentiment,
                "timestamp": datetime.now().isoformat()
            }],
            ids=[str(uuid.uuid4())]
        )


    # ------------------------------
    # Retrieve Insights / Stats
    # ------------------------------

    def get_insights(self, session_id: str) -> Dict:
        """
        Get AI-generated insights for a session
        """

        # Query using metadata instead of empty query_text
        results = self.conversations.get(
            where={"session_id": session_id},
            limit=100
        )

        if not results or len(results.get("metadatas", [])) == 0:
            return {
                "sentiment_trend": "neutral",
                "engagement_score": 50,
                "summary": "New conversation started"
            }

        sentiments = [m["sentiment"] for m in results["metadatas"]]

        positive_count = sentiments.count("positive")
        negative_count = sentiments.count("negative")

        if positive_count > negative_count:
            trend = "positive"
            score = 80
        elif negative_count > positive_count:
            trend = "negative"
            score = 40
        else:
            trend = "neutral"
            score = 60

        return {
            "sentiment_trend": trend,
            "engagement_score": score,
            "summary": f"Customer exchanged {len(sentiments)} messages with {trend} sentiment"
        }


    # ------------------------------
    # Semantic Search
    # ------------------------------

    def search_similar_conversations(self, query: str, n_results: int = 5) -> List[Dict]:
        """
        Find similar conversations using vector search
        """

        if self.conversations.count() == 0:
            return []

        results = self.conversations.query(
            query_texts=[query],
            n_results=n_results
        )

        return results


    # ------------------------------
    # Customer Profile Storage
    # ------------------------------

    def store_customer_profile(self, customer_id: str, profile_data: Dict):
        """
        Store customer profile for personalization.
        Overwrites existing profile if already exists.
        """
        self.insights.upsert(
            documents=[str(profile_data)],
            metadatas=[{
                "customer_id": customer_id,
                "timestamp": datetime.now().isoformat()
            }],
            ids=[customer_id]
        )
