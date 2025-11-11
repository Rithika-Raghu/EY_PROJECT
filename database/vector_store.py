import chromadb
from chromadb.config import Settings
from typing import List, Dict
import uuid
from datetime import datetime

class ChromaDBStore:
    """
    ChromaDB Vector Store for conversation history and insights
    """
    
    def __init__(self):
        # Initialize ChromaDB
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        
        # Create collections
        self.conversations = self.client.get_or_create_collection(
            name="conversations",
            metadata={"description": "Customer conversations"}
        )
        
        self.insights = self.client.get_or_create_collection(
            name="insights",
            metadata={"description": "Customer insights and analytics"}
        )
    
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
    
    def get_insights(self, session_id: str) -> Dict:
        """
        Get AI-generated insights for a session
        """
        # Query conversations for this session
        results = self.conversations.query(
            query_texts=[""],
            where={"session_id": session_id},
            n_results=100
        )
        
        if not results['metadatas'] or len(results['metadatas'][0]) == 0:
            return {
                "sentiment_trend": "neutral",
                "engagement_score": 50,
                "summary": "New conversation started"
            }
        
        # Analyze sentiment trend
        sentiments = [m['sentiment'] for m in results['metadatas'][0]]
        positive_count = sentiments.count('positive')
        negative_count = sentiments.count('negative')
        
        if positive_count > negative_count:
            sentiment_trend = "positive"
            engagement_score = 80
        elif negative_count > positive_count:
            sentiment_trend = "negative"
            engagement_score = 40
        else:
            sentiment_trend = "neutral"
            engagement_score = 60
        
        return {
            "sentiment_trend": sentiment_trend,
            "engagement_score": engagement_score,
            "summary": f"Customer engaged in {len(sentiments)} messages with {sentiment_trend} sentiment"
        }
    
    def search_similar_conversations(self, query: str, n_results: int = 5) -> List[Dict]:
        """
        Find similar customer conversations
        """
        results = self.conversations.query(
            query_texts=[query],
            n_results=n_results
        )
        
        return results
    
    def store_customer_profile(self, customer_id: str, profile_data: Dict):
        """
        Store customer profile for personalization
        """
        self.insights.add(
            documents=[str(profile_data)],
            metadatas=[{
                "customer_id": customer_id,
                "timestamp": datetime.now().isoformat()
            }],
            ids=[customer_id]
        )
