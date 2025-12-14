using AutoMapper;
using Microsoft.Win32;
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

            CreateMap<UpdateClientDTO, Client>()
                .ForMember(x => x.Id, opt => opt.Ignore())
                .ForMember(x => x.Password, opt => opt.Ignore()) // Пароль не меняем через это DTO
                .ForMember(x => x.Role, opt => opt.Ignore()) //роль тоже
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                    srcMember != null));// Обновляем только те поля, которые пришли в запросе
        }
    }
}
