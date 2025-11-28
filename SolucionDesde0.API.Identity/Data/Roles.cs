namespace SolucionDesde0.API.Identity.Data;
public static class Roles
{
    public const string Admin = nameof(Admin);
    public const string Member = nameof(Member);

    public static IEnumerable<string> GetAll()
    {
        yield return Admin;
        yield return Member;
    }
}