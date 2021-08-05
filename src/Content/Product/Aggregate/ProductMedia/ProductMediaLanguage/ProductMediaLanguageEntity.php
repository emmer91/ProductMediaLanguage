<?php declare(strict_types=1);

namespace ProductMediaLanguage\Content\Product\Aggregate\ProductMedia\ProductMediaLanguage;

use Shopware\Core\Content\Product\Aggregate\ProductMedia\ProductMediaEntity;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;
use Shopware\Core\System\Language\LanguageEntity;

class ProductMediaLanguageEntity extends Entity
{
    use EntityIdTrait;

    protected string $languageId = Defaults::LANGUAGE_SYSTEM;
    protected ?string $productMediaId = '';
    protected string $productMediaVersionId = Defaults::LIVE_VERSION;
    protected ?bool $cover;
    protected ?array $customFields;
    protected ?ProductMediaEntity $productMedia;
    protected ?LanguageEntity $language;

    public function getLanguageId(): string
    {
        return $this->languageId;
    }

    public function setLanguageId(string $languageId): void
    {
        $this->languageId = $languageId;
    }

    public function getProductMediaId(): ?string
    {
        return $this->productMediaId;
    }

    public function setProductMediaId(?string $productMediaId): void
    {
        $this->productMediaId = $productMediaId;
    }

    public function getProductMediaVersionId(): string
    {
        return $this->productMediaVersionId;
    }

    public function setProductMediaVersionId(string $productMediaVersionId): void
    {
        $this->productMediaVersionId = $productMediaVersionId;
    }

    public function isCover(): ?bool
    {
        return $this->cover;
    }

    public function setCover(?bool $cover): void
    {
        $this->cover = $cover;
    }

    public function getCustomFields(): ?array
    {
        return $this->customFields;
    }

    public function setCustomFields(?array $customFields): void
    {
        $this->customFields = $customFields;
    }

    public function getProductMedia(): ?ProductMediaEntity
    {
        return $this->productMedia;
    }

    public function setProductMedia(?ProductMediaEntity $productMedia): void
    {
        $this->productMedia = $productMedia;
    }

    public function getLanguage(): ?LanguageEntity
    {
        return $this->language;
    }

    public function setLanguage(?LanguageEntity $language): void
    {
        $this->language = $language;
    }
}
