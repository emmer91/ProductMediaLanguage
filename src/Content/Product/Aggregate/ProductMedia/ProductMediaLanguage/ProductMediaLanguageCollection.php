<?php declare(strict_types=1);

namespace ProductMediaLanguage\Content\Product\Aggregate\ProductMedia\ProductMediaLanguage;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @method void                add(ProductMediaLanguageEntity $entity)
 * @method void                set(string $key, ProductMediaLanguageEntity $entity)
 * @method ProductMediaLanguageEntity[]    getIterator()
 * @method ProductMediaLanguageEntity[]    getElements()
 * @method ProductMediaLanguageEntity|null get(string $key)
 * @method ProductMediaLanguageEntity|null first()
 * @method ProductMediaLanguageEntity|null last()
 */
class ProductMediaLanguageCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return ProductMediaLanguageEntity::class;
    }
}
