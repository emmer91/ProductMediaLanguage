<?php declare(strict_types=1);

namespace ProductMediaLanguage\Core\System\Language;

use ProductMediaLanguage\Content\Product\Aggregate\ProductMedia\ProductMediaLanguage\ProductMediaLanguageDefinition;
use Shopware\Core\System\Language\LanguageDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityExtension;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Extension;

class LanguageDefinitionExtension extends EntityExtension
{
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add(
            (new OneToManyAssociationField(
                'productMediaLanguage',
                ProductMediaLanguageDefinition::class,
                'language_id',
                'id'
            ))->addFlags(new CascadeDelete(), new Extension())
        );
    }

    public function getDefinitionClass(): string
    {
        return LanguageDefinition::class;
    }
}
