export class FilterEngine {
  constructor(dataset) {
    this.dataset = dataset;
  }

  filter(criteria) {
    return this.dataset.filter(loc => {
      // 1. "Category & Below" Price Filter
      if (criteria.maxPrice !== 'all') {
        const maxLevel = parseInt(criteria.maxPrice, 10);
        if (loc.priceLevel > maxLevel) return false;
      }

      // 2. Style Filter
      if (criteria.style === 'buffet' && !loc.isBuffet) return false;
      if (criteria.style === 'sitdown' && loc.isBuffet) return false;

      // 3. Cuisine Filter
      if (criteria.cuisine !== 'all' && loc.cuisine !== criteria.cuisine) return false;

      // 4. Distance Radius Filter (Category & Below)
      if (loc.distMiles > criteria.maxRadius) return false;

      return true;
    });
  }
}
