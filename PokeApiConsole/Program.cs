// Poke api Http example
using System.Text.Json;

Uri uri = new Uri("https://pokeapi.co/api/v2/");

HttpClient client = new HttpClient();

var result = await client.GetAsync(uri + "pokemon/charmander");

var content = await result.Content.ReadAsStringAsync();

//Console.WriteLine(content);

Pokemon pokemon = JsonSerializer.Deserialize<Pokemon>(content)!;    

Console.WriteLine($"Pokemon name: {pokemon.name}");

