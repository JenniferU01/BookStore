# 📚 BookStore – Proyecto móvil con API

Aplicación móvil desarrollada en la materia **Desarrollo de Aplicaciones Web**.  

BookStore es una app tipo **biblioteca personal** que permite consultar, agregar, editar, eliminar y marcar como favoritos diferentes libros.  
La app móvil está construida con **Expo (React Native + TypeScript)** y consume una **API REST** desarrollada en **Node.js + Express + TypeScript**.

---

## 🧩 Objetivo del proyecto

- Practicar la creación de una **app móvil** con Expo / React Native.
- Consumir una **API REST real** alojada en la misma red local.
- Implementar un flujo **CRUD completo** (Create, Read, Update, Delete) para libros.
- Manejar **navegación** con Stack + Tabs, estado, favoritos y almacenamiento local.
- Entregar un proyecto integrador que combine **frontend móvil + backend**.

---

## 🛠 Tecnologías utilizadas

### Frontend (móvil)

- React Native + Expo
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage (favoritos offline)
- Fetch API (llamadas HTTP)
- Estilos con StyleSheet

### Backend (API)

- Node.js
- Express
- TypeScript
- CORS
- Persistencia sencilla en archivo `books.json`

---

## 🧱 Estructura general del proyecto

El proyecto está dividido en dos carpetas principales:

```txt
C:\Proyectos\
 ├─ BookStore\        # App móvil (Expo / React Native)
 └─ api\              # API REST (Node.js + Express + TypeScript)
