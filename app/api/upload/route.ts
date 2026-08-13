import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Proxy the upload to Imgur from Vercel server (bypassing ISP blocks and CORS)
    const imgurFormData = new FormData();
    imgurFormData.append("image", file);

    const clientID = "546c25a59c58ad7"; // Public client ID for card sharing
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientID}`,
      },
      body: imgurFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Imgur server proxy error:", errorText);
      return NextResponse.json({ error: "Failed to upload to Imgur" }, { status: 500 });
    }

    const json = await response.json();
    if (json.data && json.data.id) {
      return NextResponse.json({ 
        url: `https://imgur.com/${json.data.id}`,
        imageUrl: json.data.link || `https://i.imgur.com/${json.data.id}.png`
      });
    }

    return NextResponse.json({ error: "Invalid Imgur response" }, { status: 500 });
  } catch (err: any) {
    console.error("Upload proxy route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
