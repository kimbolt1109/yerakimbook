export async function onRequestGet(context) {
  try {
    const raw = await context.env.YERA_LIBRARY.get('yera_library_data');
    if (!raw) {
      return new Response(JSON.stringify({ ok: true, data: null }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    return new Response(raw, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    if (!data || !data.state) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const payload = JSON.stringify({
      ok: true,
      data: data,
      updatedAt: new Date().toISOString()
    });
    await context.env.YERA_LIBRARY.put('yera_library_data', payload);
    return new Response(JSON.stringify({ ok: true, updatedAt: new Date().toISOString() }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
