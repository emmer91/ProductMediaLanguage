<?php declare(strict_types=1);

namespace ProductMediaLanguage\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1626975837 extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1626975837;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            CREATE TABLE IF NOT EXISTS `product_media_language` (
                `id` BINARY(16) NOT NULL,
                `language_id` BINARY(16) NOT NULL,
                `product_media_id` BINARY(16) NOT NULL,
                `product_media_version_id` BINARY(16) NOT NULL,
                `cover` TINYINT(1) NULL DEFAULT 0,
                `custom_fields` JSON NULL,
                `created_at` DATETIME(3) NOT NULL,
                `updated_at` DATETIME(3) NULL,
                PRIMARY KEY (`id`,`version_id`),
                UNIQUE KEY `product_media_language.product_media_language_unique` (`product_media_id`,`product_media_version_id`, `language_id`),
                UNIQUE KEY `product_media_language.product_media_unique` (`product_media_id`,`product_media_version_id`),
                CONSTRAINT `json.product_media_language.custom_fields` CHECK (JSON_VALID(`custom_fields`)),
                KEY `fk.product_media_language.product_media` (`product_media_id`,`product_media_version_id`),
                KEY `fk.product_media_language.language_id` (`language_id`),
                CONSTRAINT `fk.product_media_language.product_media` FOREIGN KEY (`product_media_id`,`product_media_version_id`) REFERENCES `product_media` (`id`,`version_id`) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT `fk.product_media_language.language_id` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
