using System.ComponentModel.DataAnnotations.Schema;

namespace WebHealthServer.Models
{
    public class Diet : AbstractEntity
    {
        public string Name { get; set; } // Название диеты ("Похудение", "Набор массы")
        public string Description { get; set; } // Описание диеты
        public int Calories { get; set; } // Калорийность в день
        public string Protein { get; set; } // Белки (г) 1г = 4ккал 
        public string Carbs { get; set; } // Углеводы (г) 1г = 4ккал 
        public string Fats { get; set; } // Жиры (г) 1г = 9ккал 
        public string MealPlan { get; set; } // План питания (текст или JSON)
    }
}
