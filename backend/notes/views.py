from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny,IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework.generics import get_object_or_404
from .models import Notes,UserProfile
from .serializers import NotesSerializers, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
class NotesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            note = get_object_or_404(Notes, note_id=pk, owner=request.user)  # ✅ only user’s notes
            serializer = NotesSerializers(note, context={'request': request})
            return Response(serializer.data, status=200)
        else:
            notes = Notes.objects.filter(owner=request.user)  # ✅ only user’s notes
            serializer = NotesSerializers(notes, many=True, context={'request': request})
            return Response(serializer.data, status=200)

    def post(self, request):
        serializer = NotesSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()  # `owner` is set in serializer.create()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        note = get_object_or_404(Notes, note_id=pk, owner=request.user)  # ✅ secure
        serializer = NotesSerializers(note, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def patch(self, request, pk):
        note = get_object_or_404(Notes, note_id=pk, owner=request.user)  # ✅ secure
        serializer = NotesSerializers(note, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        note = get_object_or_404(Notes, note_id=pk, owner=request.user)  # ✅ secure
        note.delete()
        return Response(status=204)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, user_email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": str(user.user_id),     # ✅ use your UUID
                    "email": user.user_email,
                    "name": user.user_name
                }
            })

        return Response({"detail": "Invalid credentials"}, status=401)






class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        print("REGISTER DATA:", data)  # 👈 Debugging

        user_email = data.get("user_email")
        user_name = data.get("user_name")
        password = data.get("password")

        # Validate required fields
        if not user_email or not user_name or not password:
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate email format
        try:
            validate_email(user_email)
        except ValidationError:
            return Response(
                {"error": "Invalid email format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for duplicates
        if UserProfile.objects.filter(user_email__iexact=user_email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create user
        user = UserProfile.objects.create(
            user_email=user_email,
            user_name=user_name,
            password=make_password(password),  # ✅ hash password
        )

        return Response(
            {
                "message": "User registered successfully",
                "user": {
                    "id": user.user_id,
                    "user_name": user.user_name,
                    "user_email": user.user_email,
                },
            },
            status=status.HTTP_201_CREATED,
        )






