"""
Loads the HuggingFace transformers pipeline ONCE and provides a safe callable.
If model download or GPU operations are slow in your environment, this file
lets you control model loading centrally.
"""

from transformers import pipeline
import threading

_lock = threading.Lock()

def _load_pipeline():
    # load a small conversational model; adapt or change to your prefered one
    try:
        pipe = pipeline(
            "text-generation",
            model="microsoft/DialoGPT-medium",
            max_new_tokens=120,
            temperature=0.8
        )
        def responder(prompt: str):
            # pipeline returns a list of dicts; return the generated text safely
            try:
                out = pipe(prompt, max_new_tokens=60)
                if isinstance(out, list) and len(out) and isinstance(out[0], dict):
                    # some pipelines use 'generated_text'
                    return out[0].get("generated_text", str(out[0]))
                return str(out)
            except Exception:
                return "I understand! Let's find a plan that suits you."
        return responder
    except Exception as e:
        # If loading fails (no internet, model missing), return a fallback function
        print("Warning: LLM pipeline failed to load:", e)
        def fallback(prompt: str):
            # a safe, deterministic fallback response
            return "Thanks — noted. (LLM not available in this environment.)"
        return fallback

# cached loader
def get_llm():
    if not hasattr(get_llm, "responder"):
        with _lock:
            if not hasattr(get_llm, "responder"):
                get_llm.responder = _load_pipeline()
    return get_llm.responder
