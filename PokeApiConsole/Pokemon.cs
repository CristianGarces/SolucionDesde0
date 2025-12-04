// Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);
using System.Text.Json.Serialization;

public class Ability
{
    [JsonPropertyName("ability")]
    public Ability ability { get; set; }

    [JsonPropertyName("is_hidden")]
    public bool is_hidden { get; set; }

    [JsonPropertyName("slot")]
    public int slot { get; set; }
}

public class Ability2
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class Animated
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class BlackWhite
{
    [JsonPropertyName("animated")]
    public Animated animated { get; set; }

    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Cries
{
    [JsonPropertyName("latest")]
    public string latest { get; set; }

    [JsonPropertyName("legacy")]
    public string legacy { get; set; }
}

public class Crystal
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_transparent")]
    public string back_shiny_transparent { get; set; }

    [JsonPropertyName("back_transparent")]
    public string back_transparent { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_transparent")]
    public string front_shiny_transparent { get; set; }

    [JsonPropertyName("front_transparent")]
    public string front_transparent { get; set; }
}

public class DiamondPearl
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class DreamWorld
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }
}

public class Emerald
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }
}

public class FireredLeafgreen
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }
}

public class Form
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class GameIndex
{
    [JsonPropertyName("game_index")]
    public int game_index { get; set; }

    [JsonPropertyName("version")]
    public Version version { get; set; }
}

public class Generation
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class GenerationI
{
    [JsonPropertyName("red-blue")]
    public RedBlue redblue { get; set; }

    [JsonPropertyName("yellow")]
    public Yellow yellow { get; set; }
}

public class GenerationIi
{
    [JsonPropertyName("crystal")]
    public Crystal crystal { get; set; }

    [JsonPropertyName("gold")]
    public Gold gold { get; set; }

    [JsonPropertyName("silver")]
    public Silver silver { get; set; }
}

public class GenerationIii
{
    [JsonPropertyName("emerald")]
    public Emerald emerald { get; set; }

    [JsonPropertyName("firered-leafgreen")]
    public FireredLeafgreen fireredleafgreen { get; set; }

    [JsonPropertyName("ruby-sapphire")]
    public RubySapphire rubysapphire { get; set; }
}

public class GenerationIv
{
    [JsonPropertyName("diamond-pearl")]
    public DiamondPearl diamondpearl { get; set; }

    [JsonPropertyName("heartgold-soulsilver")]
    public HeartgoldSoulsilver heartgoldsoulsilver { get; set; }

    [JsonPropertyName("platinum")]
    public Platinum platinum { get; set; }
}

public class GenerationV
{
    [JsonPropertyName("black-white")]
    public BlackWhite blackwhite { get; set; }
}

public class GenerationVi
{
    [JsonPropertyName("omegaruby-alphasapphire")]
    public OmegarubyAlphasapphire omegarubyalphasapphire { get; set; }

    [JsonPropertyName("x-y")]
    public XY xy { get; set; }
}

public class GenerationVii
{
    [JsonPropertyName("icons")]
    public Icons icons { get; set; }

    [JsonPropertyName("ultra-sun-ultra-moon")]
    public UltraSunUltraMoon ultrasunultramoon { get; set; }
}

public class GenerationViii
{
    [JsonPropertyName("icons")]
    public Icons icons { get; set; }
}

public class Gold
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_transparent")]
    public string front_transparent { get; set; }
}

public class HeartgoldSoulsilver
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Home
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Icons
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }
}

public class Move
{
    [JsonPropertyName("move")]
    public Move move { get; set; }

    [JsonPropertyName("version_group_details")]
    public List<VersionGroupDetail> version_group_details { get; set; }
}

public class Move2
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class MoveLearnMethod
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class OfficialArtwork
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }
}

public class OmegarubyAlphasapphire
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Other
{
    [JsonPropertyName("dream_world")]
    public DreamWorld dream_world { get; set; }

    [JsonPropertyName("home")]
    public Home home { get; set; }

    [JsonPropertyName("official-artwork")]
    public OfficialArtwork officialartwork { get; set; }

    [JsonPropertyName("showdown")]
    public Showdown showdown { get; set; }
}

public class PastAbility
{
    [JsonPropertyName("abilities")]
    public List<Ability> abilities { get; set; }

    [JsonPropertyName("generation")]
    public Generation generation { get; set; }
}

public class Platinum
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class RedBlue
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_gray")]
    public string back_gray { get; set; }

    [JsonPropertyName("back_transparent")]
    public string back_transparent { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_gray")]
    public string front_gray { get; set; }

    [JsonPropertyName("front_transparent")]
    public string front_transparent { get; set; }
}

public class Pokemon
{
    [JsonPropertyName("abilities")]
    public List<Ability> abilities { get; set; }

    [JsonPropertyName("base_experience")]
    public int base_experience { get; set; }

    [JsonPropertyName("cries")]
    public Cries cries { get; set; }

    [JsonPropertyName("forms")]
    public List<Form> forms { get; set; }

    [JsonPropertyName("game_indices")]
    public List<GameIndex> game_indices { get; set; }

    [JsonPropertyName("height")]
    public int height { get; set; }

    [JsonPropertyName("held_items")]
    public List<object> held_items { get; set; }

    [JsonPropertyName("id")]
    public int id { get; set; }

    [JsonPropertyName("is_default")]
    public bool is_default { get; set; }

    [JsonPropertyName("location_area_encounters")]
    public string location_area_encounters { get; set; }

    [JsonPropertyName("moves")]
    public List<Move> moves { get; set; }

    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("order")]
    public int order { get; set; }

    [JsonPropertyName("past_abilities")]
    public List<PastAbility> past_abilities { get; set; }

    [JsonPropertyName("past_types")]
    public List<object> past_types { get; set; }

    [JsonPropertyName("species")]
    public Species species { get; set; }

    [JsonPropertyName("sprites")]
    public Sprites sprites { get; set; }

    [JsonPropertyName("stats")]
    public List<Stat> stats { get; set; }

    [JsonPropertyName("types")]
    public List<Type> types { get; set; }

    [JsonPropertyName("weight")]
    public int weight { get; set; }
}

public class RubySapphire
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }
}

public class Showdown
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Silver
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_transparent")]
    public string front_transparent { get; set; }
}

public class Species
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class Sprites
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_female")]
    public object back_female { get; set; }

    [JsonPropertyName("back_shiny")]
    public string back_shiny { get; set; }

    [JsonPropertyName("back_shiny_female")]
    public object back_shiny_female { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }

    [JsonPropertyName("other")]
    public Other other { get; set; }

    [JsonPropertyName("versions")]
    public Versions versions { get; set; }
}

public class Stat
{
    [JsonPropertyName("base_stat")]
    public int base_stat { get; set; }

    [JsonPropertyName("effort")]
    public int effort { get; set; }

    [JsonPropertyName("stat")]
    public Stat stat { get; set; }
}

public class Stat2
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class Type
{
    [JsonPropertyName("slot")]
    public int slot { get; set; }

    [JsonPropertyName("type")]
    public Type type { get; set; }
}

public class Type2
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class UltraSunUltraMoon
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Version
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class VersionGroup
{
    [JsonPropertyName("name")]
    public string name { get; set; }

    [JsonPropertyName("url")]
    public string url { get; set; }
}

public class VersionGroupDetail
{
    [JsonPropertyName("level_learned_at")]
    public int level_learned_at { get; set; }

    [JsonPropertyName("move_learn_method")]
    public MoveLearnMethod move_learn_method { get; set; }

    [JsonPropertyName("order")]
    public int? order { get; set; }

    [JsonPropertyName("version_group")]
    public VersionGroup version_group { get; set; }
}

public class Versions
{
    [JsonPropertyName("generation-i")]
    public GenerationI generationi { get; set; }

    [JsonPropertyName("generation-ii")]
    public GenerationIi generationii { get; set; }

    [JsonPropertyName("generation-iii")]
    public GenerationIii generationiii { get; set; }

    [JsonPropertyName("generation-iv")]
    public GenerationIv generationiv { get; set; }

    [JsonPropertyName("generation-v")]
    public GenerationV generationv { get; set; }

    [JsonPropertyName("generation-vi")]
    public GenerationVi generationvi { get; set; }

    [JsonPropertyName("generation-vii")]
    public GenerationVii generationvii { get; set; }

    [JsonPropertyName("generation-viii")]
    public GenerationViii generationviii { get; set; }
}

public class XY
{
    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_female")]
    public object front_female { get; set; }

    [JsonPropertyName("front_shiny")]
    public string front_shiny { get; set; }

    [JsonPropertyName("front_shiny_female")]
    public object front_shiny_female { get; set; }
}

public class Yellow
{
    [JsonPropertyName("back_default")]
    public string back_default { get; set; }

    [JsonPropertyName("back_gray")]
    public string back_gray { get; set; }

    [JsonPropertyName("back_transparent")]
    public string back_transparent { get; set; }

    [JsonPropertyName("front_default")]
    public string front_default { get; set; }

    [JsonPropertyName("front_gray")]
    public string front_gray { get; set; }

    [JsonPropertyName("front_transparent")]
    public string front_transparent { get; set; }
}

