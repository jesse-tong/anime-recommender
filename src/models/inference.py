feature_sparse_mat_path = './models/UserAnime_Pivot.pkl'
anime_db_parquet_path = './models/anime_db.parquet' #Anime details
trained_model_path = './models/trained_model.pkl'
anime_index_path = './models/anime_index.pkl' #Needed for inference and convert return features to id

import scipy, pickle
from scipy.sparse import csr_matrix
import pandas as pd
import numpy as np
from pandas.arrays import SparseArray
from sklearn.neighbors import KNeighborsClassifier, NearestNeighbors

#with open(anime_index_path, 'rb') as f:
anime_index = pd.read_pickle(anime_index_path)

with open(feature_sparse_mat_path, 'rb') as f:
  features_mat = pickle.load(f)

number_of_top_index = 20

model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
model_knn.fit(features_mat)

def recommend_anime(mal_id: str):
  mal_id = int(mal_id)

  matrix_index = anime_index.get_loc(mal_id)

  anime_features = features_mat[matrix_index, :]
  #Inference
  neighbors = model_knn.kneighbors(anime_features, return_distance=False)

  #Convert back to MAL ID
  mal_ids = anime_index[neighbors.ravel()]

  mal_ids = [i for i in mal_ids if i != mal_id]
  return mal_ids

anime_db = pd.read_parquet(anime_db_parquet_path)
def get_anime(mal_id):
  mal_id = int(mal_id)
  return anime_db[anime_db['anime_id'] == mal_id].iloc[0, : ]

def get_animes(mal_ids):
  return anime_db.set_index('anime_id').loc[mal_ids, :]

def search_anime(query_str):
  query_str = query_str.lower()
  query_df = anime_db[anime_db['title'].str.lower().str.contains(query_str)]
  return query_df.sort_values('popularity_rank', ascending=True)

def highest_rating_anime():
  return anime_db.sort_values(by='score_rank', ascending=True, na_position='last').head(number_of_top_index)

def highest_popularity_anime():
  return anime_db[anime_db['popularity_rank'] != 0 ].sort_values(by='popularity_rank', ascending=True, na_position='last').head(number_of_top_index)

def get_anime_for_page(page):
  return anime_db.sort_values(by='anime_id', ascending=True, na_position='last').loc[page*20:(page+1)*20, : ]