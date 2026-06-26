import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords


class TextProcessor:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))

    def preprocess(self, text: str) -> str:
        # Lowercase
        text = text.lower()
        # Tokenize
        tokens = word_tokenize(text)
        # Remove stopwords and non-alphabetic tokens
        tokens = [t for t in tokens if t.isalpha() and t not in self.stop_words]
        # Rejoin for VADER (VADER works on full sentences too, but we clean for consistency)
        return ' '.join(tokens)
