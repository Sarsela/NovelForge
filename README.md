# NovelForge 
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sarsela_NovelForge&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Sarsela_NovelForge&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Sarsela_NovelForge&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Sarsela_NovelForge&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Sarsela_NovelForge&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
---
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-dark.svg)](https://sonarcloud.io/summary/new_code?id=Sarsela_NovelForge)
---

graph TB
    subgraph NovelForge
        %% Актёры
        Guest((Неавторизованный))
        Reader((Читатель))
        Author((Автор))
        
        %% Гость
        Guest --> |Просмотр каталога| UC1[Просмотр списка новелл]
        Guest --> |Поиск| UC2[Поиск по названию]
        Guest --> |Фильтрация| UC3[Фильтрация по жанру]
        Guest --> |Сортировка| UC4[Сортировка]
        Guest --> |Регистрация| UC5[Регистрация]
        Guest --> |Вход| UC6[Вход в систему]
        
        %% Читатель
        Reader --> |Чтение сцены| UC7[Просмотр сцены]
        Reader --> |Выбор| UC8[Выбор варианта]
        Reader --> |Прогресс| UC9[Автосохранение]
        Reader --> |Оценка| UC10[Поставить оценку]
        Reader --> |Комментарий| UC11[Оставить комментарий]
        
        %% Автор
        Author --> |Создание| UC12[Создание новеллы]
        Author --> |Сцены| UC13[Добавление сцены]
        Author --> |Редактирование| UC14[Редактирование сцены]
        Author --> |Выборы| UC15[Добавление выбора]
        Author --> |Предпросмотр| UC16[Предпросмотр]
        Author --> |Публикация| UC17[Публикация]
        Author --> |Экспорт| UC18[Экспорт в JSON]
    end
    
    Reader -.-> |наследует| Guest
    Author -.-> |наследует| Reader
