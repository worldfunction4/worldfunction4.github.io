---
title: 基础操作CRUD
date: 2026-10-21
category:
- 数据库
---
#  基础操作CRUD
SQL语句的基础操作那基本就是CRUD（增删改查了），均以关于音乐专辑和歌手等为例子。

## 增

- **语法**：`INSERT INTO 表名 (列1, 列2) VALUES (值1, 值2);`
- **示例**：往 `Artist` 表新增一位歌手    
```sql
    INSERT INTO Artist (Name) VALUES ('Jay Chou');
```   

## 查

- **语法**：`SELECT 列名 FROM 表名 WHERE 条件;`
- **示例**：查出所有歌手 / 查出编号为 51 的歌手  
```sql
    SELECT * FROM Artist;
    SELECT Name FROM Artist WHERE ArtistId = 51; 
```

## 改

- **语法**：`UPDATE 表名 SET 列名 = 新值 WHERE 筛选条件;`
- **示例**：将编号为 51 的歌手名字修改为 `'Queen Band'`
```sql
UPDATE Artist SET Name = 'Queen Band' WHERE ArtistId = 51;
```

## 删

- **语法**：`DELETE FROM 表名 WHERE 筛选条件;`
- **示例**：删除名字叫 `'Jay Chou'` 的歌手
```sql
DELETE FROM Artist WHERE Name = 'Jay Chou';
```

#  进阶操作
## 模糊查询(`LIKE` 与 `%` 通配符)
搜索包含特定关键字的内容（如搜索包含 "Greatest" 的专辑）
```sql
SELECT * FROM Album WHERE Title LIKE '%Greatest%';
```

## 多条件组合（`AND`）
同时满足多个筛选条件（如标题含 "Greatest" **并且** 歌手编号为 51)
```sql
SELECT * FROM Album WHERE Title LIKE '%Greatest%' AND ArtistId = 51;
```

## 外键与多表连接（`JOIN ... ON`）
利用外键（`ArtistId`）将两张独立的表（专辑表与歌手表）拼在一起查询
```sql
SELECT Title, Name 
FROM Album 
JOIN Artist ON Album.ArtistId = Artist.ArtistId;
```

## 多表连接后条件筛选（`JOIN` + `WHERE`）
在跨表拼接的结果中，进一步筛选特定歌手（如只看 Queen 乐队的专辑）
```sql
SELECT Title, Name 
FROM Album 
JOIN Artist ON Album.ArtistId = Artist.ArtistId 
WHERE Name = 'Queen';
```


## 分组与聚合统计（`GROUP BY` + `COUNT(*)`）
按指定字段（歌手名字）分组，并计算组内数量（统计每位歌手各出了多少张专辑）
```sql
SELECT Name, COUNT(*) 
FROM Album 
JOIN Artist ON Album.ArtistId = Artist.ArtistId 
GROUP BY Artist.Name;
```


## 分组统计结果排序（`GROUP BY` + `ORDER BY`）
对聚合统计出的数量（`COUNT(*)`）进行降序排列，找出产出最多的歌手排行榜
```sql
SELECT Name, COUNT(*) 
FROM Album 
JOIN Artist ON Album.ArtistId = Artist.ArtistId 
GROUP BY Artist.Name 
ORDER BY COUNT(*) DESC;
```


