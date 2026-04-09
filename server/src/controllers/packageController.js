import {
  getAllPackages,
  getPackageById,
  getFeaturedPackages,
  getFilterOptions,
} from '../services/packageService.js';

export function listPackages(req, res) {
  try {
    const packages = getAllPackages(req.query);
    res.json({ data: packages, count: packages.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
}

export function getPackage(req, res) {
  try {
    const pkg = getPackageById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ data: pkg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch package' });
  }
}

export function listFeatured(_req, res) {
  try {
    const packages = getFeaturedPackages();
    res.json({ data: packages, count: packages.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured packages' });
  }
}

export function getFilters(_req, res) {
  try {
    const filters = getFilterOptions();
    res.json({ data: filters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
}
