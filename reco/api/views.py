from django.shortcuts import render
import requests 
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
import pickle
from django.http import JsonResponse


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

movies = None
similarity = None

def load_data():
    global movies  
    global similarity  

    try:
        movies = pickle.load(open('models/movie_list.pkl', 'rb'))
        similarity = pickle.load(open('models/similarity.pkl', 'rb'))
    except Exception as e:
        print(f"An error occurred: {e}")

load_data()

def recommend(movie_title):
    try:
        movie_index = movies[movies['title'] == movie_title].index[0]
        distances = similarity[movie_index]
        recommended_movies = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])

        result = [{
            "movie_id": int(movies.iloc[movie_index]['movie_id']),
            "title": movies.iloc[movie_index]['title']
        }]  

        result.extend([{
            "movie_id": int(movies.iloc[i[0]]['movie_id']),
            "title": movies.iloc[i[0]]['title']
        } for i in recommended_movies[1:8]])  

        return result

    except IndexError:
        return []  

@api_view(['GET'])
@permission_classes([AllowAny])
def get_recommendations(request):
    movie_title = request.GET.get('movie')
    recommendations = recommend(movie_title)
    
    movie_details = []
    
    for movie in recommendations:
        details_response = fetch_movie_details(movie['movie_id']) 
        
        if details_response.status_code == 200:  
            movie_details.append(details_response.data)  
            
    return JsonResponse({'recommendations': movie_details})

def fetch_movie_details(movie_id):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={settings.TMDB_API_KEY}"

    headers = {
        'Authorization': f'Bearer {settings.TMDB_READ_ACCESS_TOKEN}'
    }
    
    try:
        response = requests.get(tmdb_url, headers=headers)
        
        if response.status_code == 200:
            return Response(response.json())  
        else:
            return Response({'error': 'Failed to fetch data from TMDB'}, status=response.status_code)
    except Exception as e:
        return Response({'error': str(e)}, status=500)



@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_trending_movies(request):
    tmdb_url = f"https://api.themoviedb.org/3/trending/all/day?api_key={settings.TMDB_API_KEY}"

    headers = {
        'Authorization': f'Bearer {settings.TMDB_READ_ACCESS_TOKEN}'
    }
    
    try:
        response = requests.get(tmdb_url, headers=headers)
        data = response.json()

        if response.status_code == 200:
            return Response(data)  
        else:
            return Response({'error': 'Failed to fetch data from TMDB'}, status=response.status_code)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_tmdb_movies(request):
    tmdb_url = f"https://api.themoviedb.org/3/movie/popular?api_key={settings.TMDB_API_KEY}"

    headers = {
        'Authorization': f'Bearer {settings.TMDB_READ_ACCESS_TOKEN}'
    }

    try:
        response = requests.get(tmdb_url, headers=headers)
        data = response.json()

        if response.status_code == 200:
            return Response(data)  
        else:
            return Response({'error': 'Failed to fetch data from TMDB'}, status=response.status_code)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_tv(request):
    tmdb_url = f"https://api.themoviedb.org/3/tv/popular?api_key={settings.TMDB_API_KEY}"

    headers = {
        'Authorization': f'Bearer {settings.TMDB_READ_ACCESS_TOKEN}'
    }

    try:
        response = requests.get(tmdb_url, headers=headers)
        data = response.json()

        if response.status_code == 200:
            return Response(data)  
        else:
            return Response({'error': 'Failed to fetch data from TMDB'}, status=response.status_code)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
