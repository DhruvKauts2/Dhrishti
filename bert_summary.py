from summarizer import Summarizer, TransformerSummarizer
from newspaper import fulltext
import requests
import sys
import re
article=str(sys.argv[1])
bert_model = Summarizer()
bert_summary = ''.join(bert_model(article, min_length = 100, max_length = 200))  #summary length is 10% of article length
print(bert_summary)
sys.stdout.flush()
