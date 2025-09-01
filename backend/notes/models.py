import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.conf import settings

class UserProfileManager(BaseUserManager):
    def create_user(self, user_email, user_name, password=None, **extra_fields):
        if not user_email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(user_email)
        user = self.model(user_email=email, user_name=user_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_email, user_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(user_email, user_name, password, **extra_fields)


class UserProfile(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_email = models.EmailField(max_length=255, unique=True)
    user_name = models.CharField(max_length=255)
    last_update = models.DateField(auto_now=True)
    create_on = models.DateField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "user_email"
    REQUIRED_FIELDS = ["user_name"]

    objects = UserProfileManager()

    def __str__(self):
        return self.user_email


class Notes(models.Model):
    note_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    note_title = models.CharField(max_length=15)
    note_content = models.TextField()
    last_update = models.DateField(auto_now=True)
    create_on = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes"
    )

    def __str__(self):
        return self.note_title
