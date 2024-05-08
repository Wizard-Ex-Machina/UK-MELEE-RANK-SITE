import { log } from "console";
import { getMatchesForId } from "~/server/queries/getMatchesForID";
import { getRatingsForId } from "~/server/queries/getRatingsForID";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Assuming getMatchesForId and getRatingsForId return the required data
  const matches = await getMatchesForId(id);
  const ratings = await getRatingsForId(id);

  // Format the response data with the fetched information
  const responseData = {
    id: id,
    matches: matches,
    ratings: ratings,
  };

  return Response.json({ data: responseData });
}
