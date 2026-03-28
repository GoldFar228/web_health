using AutoMapper;
using Microsoft.Win32;
using WebHealthServer.DTOs;
using WebHealthServer.Models;
using WebHealthServer.Models.Enums;

namespace WebHealthServer.Services
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<ClientDTO, Client>()
                .ForMember(X => X.Id, opt => opt.Ignore())
                .ForMember(x => x.Role, opt => opt.MapFrom(_ => UserRoleEnum.User))
                .ForMember(x => x.Password, opt => opt.MapFrom(s => BCrypt.Net.BCrypt.HashPassword(s.Password, BCrypt.Net.SaltRevision.Revision2B)))
                .ForMember(x => x.BirthDate, opt => opt.MapFrom(s => DateOnly.FromDateTime(DateTime.Now)))
                .ForMember(x => x.HealthIssues, opt => opt.MapFrom(_ => string.Empty))
                .ForMember(x => x.Height, opt => opt.MapFrom(_ => string.Empty))
                .ForMember(x => x.Weight, opt => opt.MapFrom(_ => string.Empty))
                .ForMember(x => x.CoachId, opt => opt.MapFrom(_ => (int?)null))
                .ForMember(x => x.DietId, opt => opt.MapFrom(_ => (int?)null))
                //.ForMember(x => x.TrainingProgramId, opt => opt.MapFrom(_ => (int?)null))
                .ForMember(x => x.Coach, opt => opt.Ignore())
                .ForMember(x => x.Diet, opt => opt.Ignore());
            //.ForMember(x => x.TrainingProgram, opt => opt.Ignore());

            CreateMap<CreateExerciseDto, Exercise>();
            CreateMap<UpdateExerciseDto, Exercise>();
            CreateMap<Exercise, ExerciseDto>();
            CreateMap<UpdateClientDTO, Client>()
                .ForMember(x => x.Id, opt => opt.Ignore())
                .ForMember(x => x.Password, opt => opt.Ignore()) // Пароль не меняем через это DTO
                .ForMember(x => x.Role, opt => opt.Ignore()) //роль тоже
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                    srcMember != null));// Обновляем только те поля, которые пришли в запросе

            CreateMap<CreateMealEntryDto, MealEntry>()
                .ForMember(dest => dest.EntryTime,
                    opt => opt.MapFrom(src =>
                        string.IsNullOrEmpty(src.EntryTime)
                            ? TimeOnly.FromDateTime(DateTime.UtcNow)
                            : TimeOnly.Parse(src.EntryTime.Replace("Z", ""))))
                // Вычисляемые свойства игнорируем - они сами вычисляются
                .ForMember(dest => dest.Year, opt => opt.Ignore())
                .ForMember(dest => dest.Month, opt => opt.Ignore())
                .ForMember(dest => dest.Day, opt => opt.Ignore());
            // AfterMap не нужен!

            CreateMap<MealEntry, MealEntryResponseDto>()
                .ForMember(dest => dest.EntryTime,
                    opt => opt.MapFrom(src => src.EntryTime.HasValue ?
                        src.EntryTime.Value.ToTimeSpan() : (TimeSpan?)null));
            CreateMap<CreateMealEntryDto, MealEntry>()
            // Маппинг TimeOnly из строки
            .ForMember(dest => dest.EntryTime,
                opt => opt.MapFrom(src => ParseTimeOnlyFromString(src.EntryTime)))


            // Вычисляемые свойства игнорируем
            .ForMember(dest => dest.Year, opt => opt.Ignore())
            .ForMember(dest => dest.Month, opt => opt.Ignore())
            .ForMember(dest => dest.Day, opt => opt.Ignore())

            // Нутриенты: если null в DTO → 0 в Entity (защита от null)
            .ForMember(dest => dest.Calories, opt => opt.MapFrom(src => src.Calories ?? 0))
            .ForMember(dest => dest.Protein, opt => opt.MapFrom(src => src.Protein ?? 0))
            .ForMember(dest => dest.Carbohydrates, opt => opt.MapFrom(src => src.Carbohydrates ?? 0))
            .ForMember(dest => dest.Fat, opt => opt.MapFrom(src => src.Fat ?? 0))

            // Поля, которые заполняются в сервисе (не из DTO)
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ClientId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.FatSecretFoodId, opt => opt.Ignore()); // 🔗 заполняем вручную

            //CreateMap<MealEntry, MealEntryResponseDto>()
            //    // TimeSpan? для совместимости с JSON (опционально)
            //    .ForMember(dest => dest.EntryTime,
            //        opt => opt.MapFrom(src => src.EntryTime.HasValue ?
            //            src.EntryTime.Value.ToTimeSpan() : (TimeSpan?)null));
            CreateMap<MealEntry, MealEntryResponseDto>()
                .ForMember(dest => dest.EntryTime,
                    opt => opt.MapFrom(src => src.EntryTime.HasValue ?
                        src.EntryTime.Value.ToString("HH:mm:ss") : null));
        }
        private static TimeOnly? ParseTimeOnlyFromString(string? timeString)
        {
            if (string.IsNullOrEmpty(timeString))
                return TimeOnly.FromDateTime(DateTime.UtcNow);

            try
            {
                // Убираем 'Z' и миллисекунды, оставляем "HH:mm:ss"
                var cleanTime = timeString.Replace("Z", "").Split('.')[0];

                if (TimeOnly.TryParseExact(cleanTime, "HH:mm:ss", out var result))
                    return result;

                if (TimeOnly.TryParse(cleanTime, out result))
                    return result;

                return TimeOnly.FromDateTime(DateTime.UtcNow);
            }
            catch
            {
                return TimeOnly.FromDateTime(DateTime.UtcNow);
            }
        }

    }
}

