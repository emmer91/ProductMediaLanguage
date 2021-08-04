<?php declare(strict_types=1);

namespace ProductMediaLanguage\Content\Product;

use Shopware\Core\Content\Product\Aggregate\ProductMedia\ProductMediaDefinition;
use Shopware\Core\Content\Product\ProductDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class ProductDefinitionExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToManyAssociationField(
                'productMediaCoverAssociation',
                ProductMediaDefinition::class,
                'product_id'
        ))->addFlags(new ApiAware()));
    }

    public function getDefinitionClass(): string
    {
        return ProductDefinition::class;
    }
}
