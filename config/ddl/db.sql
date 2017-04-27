CREATE DATABASE thinkshake_base;
GRANT ALL ON thinkshake_base.* TO `shaker`@`%` IDENTIFIED BY 'yourshaker!';
GRANT ALL ON thinkshake_base.* TO `shaker`@`localhost` IDENTIFIED BY 'yourshaker!';
