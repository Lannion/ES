# Generated by Django 5.1.3 on 2025-01-10 00:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_billinglist_created_at_billinglist_deleted_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='enrollment_date',
            name='is_enrollment',
        ),
    ]
