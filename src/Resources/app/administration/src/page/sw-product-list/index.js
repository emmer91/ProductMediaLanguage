import template from './sw-product-list.html.twig';
const { Component, State } = Shopware;
const { Criteria } = Shopware.Data;

Component.override('sw-product-list', {
    template,
    computed: {
        productCriteria() {
            const criteria = this.$super('productCriteria');

            criteria.addAssociation('media.productMediaLanguage');
            criteria.getAssociation('media').addFilter(
                Criteria.multi('and', [
                    Criteria.equals('productMediaLanguage.languageId', State.get('context').api.languageId ),
                    Criteria.equals('productMediaLanguage.cover', true ),
                ])
            );

            return criteria;
        },

        cover() {

        }
    },
});
