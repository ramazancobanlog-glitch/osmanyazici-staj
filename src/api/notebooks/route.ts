import { NextResponse } from 'next/server';
import Notebook from '@/models/Notebook';
import connectToDatabase from '@/lib/mongodb';

// Handle POST requests to create a new notebook
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    // Validate the required fields
    const { title, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Create a new notebook document
    const newNotebook = new Notebook({
      title,
      content,
      createdAt: new Date(),
    });

    // Save the notebook to the database
    await newNotebook.save();

    // Return a success response
    return NextResponse.json({ message: 'Notebook created successfully.', notebook: newNotebook }, { status: 201 });
  } catch (error) {
    console.error('Error creating notebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}