import { NextRequest, NextResponse } from "next/server";
import { provenSolutionsDb } from "@/database/provenSolutionsDatabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const technology = searchParams.get("technology") || undefined;
  const department = searchParams.get("department") || undefined;
  const location = searchParams.get("location") || undefined;
  const sortBy = (searchParams.get("sortBy") as any) || undefined;

  const solutions = provenSolutionsDb.filterSolutions({
    search,
    category,
    technology,
    department,
    location,
    sortBy,
  });

  return NextResponse.json({
    success: true,
    totalCount: solutions.length,
    solutions,
    facets: {
      categories: provenSolutionsDb.getCategories(),
      technologies: provenSolutionsDb.getTechnologies(),
      departments: provenSolutionsDb.getDepartments(),
      locations: provenSolutionsDb.getLocations(),
    },
    queriedAt: new Date().toISOString(),
  });
}
