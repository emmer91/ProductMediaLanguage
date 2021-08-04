<?php declare(strict_types=1);

namespace ProductMediaLanguage\Content\Product\Aggregate\ProductMedia;

use ProductMediaLanguage\Content\Product\Aggregate\ProductMedia\ProductMediaLanguage\ProductMediaLanguageDefinition;
use Shopware\Core\Content\Product\Aggregate\ProductMedia\ProductMediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ProductMediaDefinitionExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToOneAssociationField(
                'productMediaLanguage',
                'id',
                'product_media_id',
                ProductMediaLanguageDefinition::class,
                false
        ))->addFlags(new ApiAware()));
    }

    public function getDefinitionClass(): string
    {
        return ProductMediaDefinition::class;
    }
}
