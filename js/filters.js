export class FilterEngine {
  constructor(dataset) {
    this.dataset = dataset;
  }

  filterAndSort(criteria) {
    let filtered = this.dataset.filter(loc => {
      // 1. Text Search Filter (Matches name, cuisine, or dishes)
      if (criteria.searchQuery) {
        const query = criteria.searchQuery.toLowerCase();
        const matchesSearch = loc.name.toLowerCase().includes(query) || 
                              loc.cuisine.toLowerCase().includes(query) || 
                              loc.dishes.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 2. Price Filter
      if (criteria.maxPrice !== 'all') {
        const maxLevel = parseInt(criteria.maxPrice, 10);
        if (loc.priceLevel > maxLevel) return false;
      }

      // 3. Buffet Filter
      if (criteria.buffetOnly && !loc.isBuffet) return false;

      // 4. Cuisine Filter
      if (criteria.cuisine !== 'all' && loc.cuisine !== criteria.cuisine) return false;

      // 5. Distance Radius Filter
      if (loc.distMiles > criteria.maxRadius) return false;

      return true;
    });

    // 6. Sorting Logic
    filtered.sort((a, b) => {
      if (criteria.sortBy === 'distAsc') return a.distMiles - b.distMiles;
      if (criteria.sortBy === 'priceAsc') return a.priceLevel - b.priceLevel;
      if (criteria.sortBy === 'priceDesc') return b.priceLevel - a.priceLevel;
      if (criteria.sortBy === 'ratingDesc') {
        const rA = parseFloat(a.rating) || 0;
        const rB = parseFloat(b.rating) || 0;
        return rB - rA;
      }
      return 0;
    });

    return filtered;
  }
}
