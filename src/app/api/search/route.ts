import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getProductCategories, getProductMaterials, getProductTags, getPriceRange } from '@/lib/cms';
import { SearchFilters } from '@/lib/cms';
import { validateSearchRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse search parameters
    const filters: SearchFilters = {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      materials: searchParams.get('materials')?.split(',').filter(Boolean) || undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    // Validate the search request
    const validationResult = validateSearchRequest(filters);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Perform search
    const searchResult = await searchProducts(filters);

    // Get filter options for the frontend
    const [categories, materials, tags, priceRange] = await Promise.all([
      getProductCategories(),
      getProductMaterials(),
      getProductTags(),
      getPriceRange()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products: searchResult.products,
        pagination: {
          total: searchResult.total,
          page: searchResult.page,
          totalPages: searchResult.totalPages,
          limit: filters.limit || 20
        },
        filters: {
          categories,
          materials,
          tags,
          priceRange
        }
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the search request
    const validationResult = validateSearchRequest(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Perform search
    const searchResult = await searchProducts(body);

    // Get filter options for the frontend
    const [categories, materials, tags, priceRange] = await Promise.all([
      getProductCategories(),
      getProductMaterials(),
      getProductTags(),
      getPriceRange()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products: searchResult.products,
        pagination: {
          total: searchResult.total,
          page: searchResult.page,
          totalPages: searchResult.totalPages,
          limit: body.limit || 20
        },
        filters: {
          categories,
          materials,
          tags,
          priceRange
        }
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
