#!/bin/bash

# Script de despliegue para producción

echo "🚀 Iniciando despliegue..."

# 1. Construir proyecto
echo "📦 Construyendo proyecto..."
npm run build

# 2. Opción para Vercel
echo "🌐 Desplegando en Vercel..."
vercel --prod

# 3. Opción para Netlify (comentado)
# echo "🔥 Desplegando en Netlify..."
# netlify deploy --prod --dir=dist

echo "✅ Despliegue completado!"
echo "🔗 Tu aplicación está disponible en la URL proporcionada"
