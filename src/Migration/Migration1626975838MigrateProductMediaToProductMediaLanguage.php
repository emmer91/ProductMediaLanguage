<?php declare(strict_types=1);

namespace ProductMediaLanguage\Migration;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1626975838MigrateProductMediaToProductMediaLanguage extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1626975838;
    }

    public function update(Connection $connection): void
    {
        $languageIds = $connection->fetchAllAssociative('
            SELECT id FROM `language`;
        ');

        foreach ($languageIds as $key => $languageId) {
            if($key === 0) {
                // set language to all product media in first language
                $connection->executeStatement('
                    INSERT INTO
                        product_media_language
                    (SELECT
                        media.id as `id`,
                        :languageId as `language_id`,
                        media.id as `product_media_id`,
                        media.version_id as `product_media_version_id`,
                        IF(product.cover IS NULL, 0, 1) as `cover`,
                        JSON_OBJECT(\'base\', \'base\') as `custom_fields`,
                        media.created_at as `created_at`,
                        NULL as `updated_at`
                    FROM
                        product_media as media
                    LEFT JOIN
                        product
                    ON media.id = product.cover AND product.parent_id IS NULL)
                  ', [':languageId' => $languageId['id']]);

                continue;
            }

            $this->migrateProductImages($connection, $languageId['id'], true);
            $this->migrateProductImages($connection, $languageId['id'], false);
        }

        $connection->executeStatement('UPDATE product_media_language SET custom_fields = NULL');
    }

    private function migrateProductImages(Connection $connection, string $languageId, bool $cover): void
    {
        $connection->executeStatement('
                INSERT INTO
                    product_media
                (SELECT
                    (UNHEX(REPLACE(UUID(), "-",""))) as `id`,
                    media.version_id as `version_id`,
                    media.position as `position`,
                    media.product_id as `product_id`,
                    media.product_version_id as `product_version_id`,
                    media.media_id as `media_id`,
                    media.custom_fields as `custom_fields`,
                    media.created_at as `created_at`,
                    media.updated_at as `updated_at`
                FROM
                    product_media as media
                INNER JOIN
                    product_media_language as pml
                ON
                    media.id = pml.product_media_id
                AND
                    pml.cover = :cover
                AND
                    JSON_EXTRACT(pml.custom_fields, \'$.base\') IS NOT NULL)
            ', [':cover' => (int) $cover]);

        $connection->executeStatement('
                INSERT INTO
                    product_media_language
                (SELECT
                    media.id as `id`,
                    :languageId as `language_id`,
                    media.id as `product_media_id`,
                    media.version_id as `product_media_version_id`,
                    :cover as `cover`,
                    NULL as `custom_fields`,
                    media.created_at as `created_at`,
                    NULL as `updated_at`
                FROM
                    product_media as media
                LEFT JOIN
                    product_media_language as pml
                ON
                    media.id = pml.product_media_id
                WHERE
                    pml.id IS NULL)
            ', [':languageId' => $languageId, ':cover' => (int) $cover]);
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}
