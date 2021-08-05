const { Component } = Shopware;
const { Criteria } = Shopware.Data;
Component.override('sw-product-detail', {
    computed: {
        productCriteria() {
            const criteria = this.$super('productCriteria');

            criteria.addAssociation('media.productMediaLanguage');
            criteria.getAssociation('media').addFilter(Criteria.equals('productMediaLanguage.languageId', Shopware.State.get('context').api.languageId ));

            return criteria;
        },
    },
});