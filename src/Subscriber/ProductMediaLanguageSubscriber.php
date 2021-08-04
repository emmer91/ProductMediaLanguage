<?php declare(strict_types=1);

namespace ProductMediaLanguage\Subscriber;

use Shopware\Core\Content\Media\MediaDefinition;
use Shopware\Core\Content\Media\Subscriber\MediaLoadedSubscriber;
use Shopware\Core\Content\Product\Events\ProductGatewayCriteriaEvent;
use Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent;
use Shopware\Core\Content\Product\ProductCollection;
use Shopware\Core\Content\Product\ProductEvents;
use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;
use Shopware\Storefront\Page\Product\ProductPageCriteriaEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ProductMediaLanguageSubscriber implements EventSubscriberInterface
{
    private MediaLoadedSubscriber $mediaLoadedSubscriber;
    private MediaDefinition $mediaDefinition;

    public function __construct(
        MediaLoadedSubscriber $mediaLoadedSubscriber,
        MediaDefinition $mediaDefinition
    ) {
        $this->mediaLoadedSubscriber = $mediaLoadedSubscriber;
        $this->mediaDefinition = $mediaDefinition;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ProductPageCriteriaEvent::class => 'filterProductDetailAssociation',
            ProductListingCriteriaEvent::class => 'filterProductListingAssociation',
            ProductGatewayCriteriaEvent::class => 'filterProductGatewayAssociation',
            ProductEvents::PRODUCT_LOADED_EVENT => 'setLanguageProductMediaLoaded',
        ];
    }

    public function setLanguageProductMediaLoaded(EntityLoadedEvent $event): void
    {
        /** @var ProductCollection $products */
        $products = $event->getEntities();

        foreach ($products as $product) {
            $coverExtension = $product->getExtension('productMediaCoverAssociation');

            if (!$coverExtension || $coverExtension->count() < 1) {
                continue;
            }

            $languageCover = $coverExtension->first();

            $event = new EntityLoadedEvent(
                $this->mediaDefinition,
                [$languageCover->media],
                $event->getContext()
            );

            //TODO: check \Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEventFactory::recursion with extension and direct collections with core
            $this->mediaLoadedSubscriber->unserialize($event);
            $this->mediaLoadedSubscriber->addUrls($event);
            $product->setCoverId($languageCover->getId());
            $product->setCover($languageCover);
        }
    }

    public function filterProductDetailAssociation(ProductPageCriteriaEvent $event): void
    {
        $this->modifyCriteria(
            $event->getCriteria(),
            $event->getSalesChannelContext()->getSalesChannel()->getLanguageId()
        );
    }

    public function filterProductGatewayAssociation(ProductGatewayCriteriaEvent $event)
    {
        $this->modifyCriteria(
            $event->getCriteria(),
            $event->getSalesChannelContext()->getSalesChannel()->getLanguageId()
        );
    }

    public function filterProductListingAssociation(ProductListingCriteriaEvent $event): void
    {
        $this->modifyCriteria(
            $event->getCriteria(),
            $event->getSalesChannelContext()->getSalesChannel()->getLanguageId()
        );
    }

    private function modifyCriteria(Criteria $criteria, string $languageId): void
    {
        $criteria->addAssociation('media.productMediaLanguage');
        $criteria->addAssociation('productMediaCoverAssociation.productMediaLanguage');
        $criteria->addAssociation('productMediaCoverAssociation.media');
        $coverMediaLanguageAssociation = $criteria->getAssociation('productMediaCoverAssociation');
        $coverMediaLanguageAssociation->addFilter(
            new MultiFilter(MultiFilter::CONNECTION_AND, [
                new EqualsFilter('productMediaLanguage.languageId', $languageId),
                new EqualsFilter('productMediaLanguage.cover', true),
            ])
        );
        $mediaLanguageAssociation = $criteria->getAssociation('media');
        $mediaLanguageAssociation->addFilter(
            new EqualsFilter('productMediaLanguage.languageId', $languageId)
        );
    }
}
