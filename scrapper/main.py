import pandas as pd
from bs4 import BeautifulSoup
import requests
import os
import firebase_admin
from firebase_admin import firestore, credentials

SDK_URL = "firebase-adminsdk-fbsvc@arepadle-db.iam.gserviceaccount.com"

URL = "https://elblogdeidiomas.es/150-palabras-venezolanas-que-llamara-tu-atencion/"

letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
           'V', 'W', 'X', 'Y', 'Z']

file_path = "venezuelan_words.csv"

def get_res(url=URL):
    return requests.get(url).text


def generate_tags_dictionary(tags):
    tags_dictionary = {}

    for letter in letters:
        tags_dictionary[letter] = []

    for tag in tags:
        clean_tag = tag.text.rstrip()

        if clean_tag.endswith(".-"):
            clean_tag = clean_tag[:-2]

        if clean_tag[0] in tags_dictionary and clean_tag not in tags_dictionary.keys():
            tags_dictionary[clean_tag[0]].append(clean_tag)

    return tags_dictionary

def create_data_csv():
    venezuelan_page = get_res()

    soup = BeautifulSoup(venezuelan_page, features="html.parser")

    words_dict = {}

    ol_element = soup.find(name="ol")
    all_list_elements = ol_element.find_all(name="li")

    for li in all_list_elements:
        word = li.find(name="strong") or li.find(name="b")
        definition = li.find(name="span")

        word_text = word.text.rstrip()[:-1] if word.text.strip().endswith(":") else word.text.strip()
        definition_text = definition.text.lstrip(":")
        words_dict[word_text] = definition_text.strip()

    df = pd.DataFrame(words_dict.items(), columns=["word", "definition"])
    df.to_csv(file_path)


def init_firestore():
    cred = credentials.Certificate("serviceAccountKey.json")
    app = firebase_admin.initialize_app(cred)

    db = firestore.client()

    return db


def init():
    if not os.path.exists(file_path):
        create_data_csv()

    db = init_firestore()

    df = pd.read_csv(file_path)

    for index, row in df.iterrows():
        word = row["word"]
        definition = row["definition"]

        doc_ref = db.collection("words").document(word)
        doc_ref.set({"definition": definition})

init()
