from django.contrib import admin
from .models import FAQ, SupportTicket

# Register your models here.

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'keywords', 'created_at')
    search_fields = ('question', 'answer', 'keywords')

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'status', 'user_query', 'created_at')
    list_filter = ('status',)
    search_fields = ('user_query', 'ticket_id')