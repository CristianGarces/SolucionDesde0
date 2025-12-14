using Microsoft.AspNetCore.Identity;

namespace SolucionDesde0.API.Identity.Data.Seeders
{
    public static class DefaultAdminSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            var adminEmail = configuration["AdminUser:Email"];
            var adminUsername = configuration["AdminUser:Username"];
            var adminPassword = configuration["AdminUser:Password"];

            var adminUser = await userManager.FindByEmailAsync(adminEmail!);
            if (adminUser == null)
            {
                adminUser = new IdentityUser
                {
                    UserName = adminUsername,
                    Email = adminEmail,
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword!);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
