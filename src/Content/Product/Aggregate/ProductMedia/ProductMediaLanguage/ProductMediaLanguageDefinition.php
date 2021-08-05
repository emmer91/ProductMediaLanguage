<?php declare(strict_types=1);

namespace ProductMediaLanguage\Content\Product\Aggregate\ProductMedia\ProductMediaLanguage;

use Shopware\Core\Content\Product\Aggregate\ProductMedia\ProductMediaDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\CustomFields;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ReferenceVersionField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;
use Shopware\Core\System\Language\LanguageDefinition;

class ProductMediaLanguageDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'product_media_language';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getCollectionClass(): string
    {
        return ProductMediaLanguageCollection::class;
    }

    public function getEntityClass(): string
    {
        return ProductMediaLanguageEntity::class;
    }
    public function since(): ?string
    {
        return '6.4.0.0';
    }

    protected function getParentDefinitionClass(): ?string
    {
        return ProductMediaDefinition::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))->addFlags(new Required(), new PrimaryKey()),
            (new FkField('product_media_id', 'productMediaId', ProductMediaDefinition::class))->addFlags(new ApiAware(), new Required()),
            (new ReferenceVersionField(ProductMediaDefinition::class))->addFlags(new ApiAware(), new Required()),
            (new FkField('language_id', 'languageId', LanguageDefinition::class))->addFlags(new ApiAware(), new Required()),
            (new BoolField('cover', 'cover'))->addFlags(new ApiAware()),
            (new CustomFields())->addFlags(new ApiAware()),
            (new ManyToOneAssociationField('language', 'language_id', LanguageDefinition::class, 'id', false))->addFlags(new ApiAware()),
            (new OnetoOneAssociationField('productMedia', 'product_media_id', 'id', ProductMediaDefinition::class, false))->addFlags(new ApiAware()),
        ]);
    }
}
