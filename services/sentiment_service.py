from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch

class SentimentAnalyzer:
    """
    Sentiment and Emotion Detection using BERT
    """
    
    def __init__(self):
        # Load pre-trained sentiment model
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.sentiment_pipeline = pipeline("sentiment-analysis", model=self.model, tokenizer=self.tokenizer)
        
    def analyze(self, text: str) -> str:
        """
        Analyze sentiment of customer message
        Returns: 'positive', 'negative', or 'neutral'
        """
        try:
            result = self.sentiment_pipeline(text)[0]
            label = result['label'].lower()
            confidence = result['score']
            
            # Map to our sentiment categories
            if label == 'positive' and confidence > 0.7:
                return 'positive'
            elif label == 'negative' and confidence > 0.7:
                return 'negative'
            else:
                return 'neutral'
                
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
            return 'neutral'
    
    def detect_emotion(self, text: str) -> Dict[str, float]:
        """
        Detect specific emotions (joy, anger, sadness, fear)
        """
        # Simplified emotion detection
        emotions = {
            'joy': 0.0,
            'anger': 0.0,
            'sadness': 0.0,
            'fear': 0.0,
            'surprise': 0.0
        }
        
        text_lower = text.lower()
        
        # Joy indicators
        if any(word in text_lower for word in ['happy', 'great', 'excellent', 'wonderful', 'fantastic']):
            emotions['joy'] = 0.8
        
        # Anger indicators
        if any(word in text_lower for word in ['angry', 'frustrated', 'annoyed', 'upset']):
            emotions['anger'] = 0.8
        
        # Sadness indicators
        if any(word in text_lower for word in ['sad', 'disappointed', 'unhappy', 'worried']):
            emotions['sadness'] = 0.7
        
        # Fear indicators
        if any(word in text_lower for word in ['afraid', 'scared', 'nervous', 'anxious']):
            emotions['fear'] = 0.7
        
        return emotions
