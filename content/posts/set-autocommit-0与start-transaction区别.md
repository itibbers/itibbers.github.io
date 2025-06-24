---
title: set autocommit=0与start transaction区别
date: 2016-11-17 14:32:49
categories:
  - frontend
tags:
  - mysql
---

set autocommit=0,
当前 session 禁用自动提交事物，自此句执行以后，每个 SQL 语句或者语句块所在的事务都需要显示"commit"才能提交事务。

start transaction

指的是启动一个新事务。

在默认的情况下，MySQL 从自动提交（autocommit）模式运行，这种模式会在每条语句执行完毕后把它作出的修改立刻提交给数据库并使之永久化。事实上，这相当于把每一条语句都隐含地当做一个事务来执行。如果你想明确地执行事务，需要禁用自动提交模式并告诉 MySQL 你想让它在何时提交或回滚有关的修改。
执行事务的常用办法是发出一条 START TRANSACTION（或 BEGIN）语句挂起自动提交模式，然后执行构成本次事务的各条语句，最后用一条 COMMIT 语句结束事务并把它们作出的修改永久性地记入数据库。万一在事务过程中发生错误，用一条 ROLLBACK 语句撤销事务并把数据库恢复到事务开 始之前的状态。

START TRANSACTION 语句"挂起"自动提交模式的含义是：在事务被提交或回滚之后，该模式将恢复到开始本次事务的 START TRANSACTION 语句被执行之前的状态。（如果自动提交模式原来是激活的，结束事务将让你回到自动提交模式；如果它原来是禁用的，结束 当前事务将开始下一个事务。）

如果是 autocommit 模式 ，autocommit 的值应该为 1 ，不 autocommit 的值是 0 ；请在试验前 确定 autocommit 的模式是否开启
