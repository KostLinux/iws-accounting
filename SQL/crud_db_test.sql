-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 22 2020 г., 12:04
-- Версия сервера: 10.4.14-MariaDB
-- Версия PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `crud_db`
--
CREATE DATABASE `crud_db`;
-- --------------------------------------------------------

--
-- Структура таблицы `crud_users`
--

CREATE TABLE `crud_users` (
  `first_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `personal_id_code` varchar(15) NOT NULL,
  `email` varchar(150) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `service` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `price` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `crud_users`
--

INSERT INTO `crud_users` (`first_name`, `last_name`, `personal_id_code`, `email`, `service`, `price`, `date`, `id`) VALUES
('Иван', 'Петров', '4892-10952-1', 'ivan.petrov@mail.ru', 'Формирование веб-сайтов', '1500', '2020-12-10', 1),
('Дарья', 'Мелехова', '4892-10952-6', 'darya.melehova@mail.ru', 'Формирование веб-сайтов', '4500', '2020-10-08', 2),
('Павел', 'Игорьев', '4892-10955-7', 'pavel.igorjev@dscompetitions.io', 'Мониторинг', '700', '2019-11-10', 3),
('Мария', 'Пугова', '4892-10960-10', 'pavel.igorjev@dscompetitions.io', 'Мониторинг', '900', '2020-11-08', 4),
('Кристофер', 'Кёст', '4892-10956-8', 'christofher.kost@sometest.ru', 'Зарплата за декабрь 2020', '1500', '2020-12-10', 5),
('Кристофер', 'Кёст', '4892-10956-8', 'christofher.kost@sometest.ru', 'Зарплата за октябрь 2020', '1800', '2020-10-10', 6),
('Кристофер', 'Кёст', '4892-10956-8', 'christofher.kost@sometest.ru', 'Зарплата за сентябрь 2019', '1500', '2019-09-10', 7),
('Кристофер', 'Кёст', '4892-10956-8', 'christofher.kost@sometest.ru', 'Зарплата за январь 2019', '1800', '2019-01-10', 8),
('Мартин', 'Сидоров', '4892-10957-11', 'martin.sidorov@sometest.ru', 'Зарплата за декабрь 2020', '1900', '2020-12-10', 9),
('Мартин', 'Сидоров', '4892-10957-11', 'martin.sidorov@sometest.ru', 'Зарплата за октябрь 2020', '2000', '2020-10-10', 10),
('Мартин', 'Сидоров', '4892-10957-11', 'martin.sidorov@sometest.ru', 'Зарплата за сентябрь 2019', '1700', '2019-09-10', 11),
('Мартин', 'Сидоров', '4892-10957-11', 'martin.sidorov@sometest.ru', 'Зарплата за январь 2019', '2200', '2019-01-10', 12),
('IT & Web Solutions', '', '60646201', 'info@itwebsolutions.co', 'Покупка Dell T30 TowerEdge', '-1200', '2020-12-21', 13),
('IT & Web Solutions', '', '60646201', 'info@itwebsolutions.co', 'Покупка Dell T40 TowerEdge', '-1500', '2020-11-26', 14),
('IT & Web Solutions', '', '60646201', 'info@itwebsolutions.co', 'Покупка MikroTiK Cloud Router', '-2200', '2019-12-21', 15),
('IT & Web Solutions', '', '60646201', 'info@itwebsolutions.co', 'Покупка Cisco Switch Catalyst 2960 series ', '-1800', '2019-12-21', 16);
--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `crud_users`
--
ALTER TABLE `crud_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `crud_users`
--
ALTER TABLE `crud_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
